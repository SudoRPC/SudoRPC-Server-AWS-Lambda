/**
 * @author WMXPY
 * @namespace AWSLambda_Handler
 * @description API Gateway
 */

import { createLambdaResponse } from "@sudoo/lambda";
import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { Pattern } from "@sudoo/pattern";
import { Verifier, VerifyResult } from "@sudoo/verify";
import { SudoRPCCall, SudoRPCReturn, SudoRPCService } from "@sudorpc/core";
import { createSudoRPCCallPattern } from "@sudorpc/pattern";
import { APIGatewayProxyHandler, Context } from "aws-lambda";
import { APIGatewayResponseCodeMaker } from "../declare/api-gateway";

const verifier: LambdaVerifier = LambdaVerifier.create()
    .setBodyPattern(createSudoRPCCallPattern());

export const createSudoRPCServerAWSLambdaAPIGatewayHandler = <Metadata, Payload, SuccessResult, FailResult>(
    service: SudoRPCService<Metadata, Payload, SuccessResult, FailResult>,
    metadataPattern: Pattern,
    payloadPattern: Pattern,
    responseCoreMaker: APIGatewayResponseCodeMaker<SuccessResult, FailResult>,
): APIGatewayProxyHandler => {

    const metadataVerifier: Verifier = Verifier.create(metadataPattern);
    const payloadVerifier: Verifier = Verifier.create(payloadPattern);

    return verifier.warpAPIGateWayProxyHandler(async (
        event: VerifiedAPIGatewayProxyEvent,
        _context: Context,
    ) => {

        const body: SudoRPCCall<Metadata, Payload> = event.verifiedBody;

        const metadataVerifyResult: VerifyResult =
            metadataVerifier.verify(body.metadata);

        if (!metadataVerifyResult.succeed) {
            return createLambdaResponse(
                HTTP_RESPONSE_CODE.BAD_REQUEST,
                "[SudoRPC] Invalid Metadata",
            );
        }

        const payloadVerifyResult: VerifyResult =
            payloadVerifier.verify(body.payload);

        if (!payloadVerifyResult.succeed) {
            return createLambdaResponse(
                HTTP_RESPONSE_CODE.BAD_REQUEST,
                "[SudoRPC] Invalid Payload",
            );
        }

        const executeResult: SudoRPCReturn<SuccessResult, FailResult> =
            await service.execute(body);

        const responseCode: HTTP_RESPONSE_CODE =
            await Promise.resolve(responseCoreMaker(executeResult));

        return createLambdaResponse(responseCode, executeResult);
    });
};
