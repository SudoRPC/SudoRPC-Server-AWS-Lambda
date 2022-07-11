/**
 * @author WMXPY
 * @namespace AWSLambda_Handler
 * @description API Gateway
 */

import { createLambdaResponse } from "@sudoo/lambda";
import { LambdaVerifier, VerifiedAPIGatewayProxyEvent } from "@sudoo/lambda-verify";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { SudoRPCCall, SudoRPCReturn, SudoRPCService } from "@sudorpc/core";
import { createSudoRPCCallPattern } from "@sudorpc/pattern";
import { APIGatewayProxyHandler, Context } from "aws-lambda";
import { APIGatewayResponseCodeMaker } from "../declare/api-gateway";

const verifier: LambdaVerifier = LambdaVerifier.create()
    .setBodyPattern(createSudoRPCCallPattern());

export const createSudoRPCServerAWSLambdaAPIGatewayHandler = <Metadata, Payload, SuccessResult, FailResult>(
    service: SudoRPCService<Metadata, Payload, SuccessResult, FailResult>,
    responseCodeMaker: APIGatewayResponseCodeMaker<SuccessResult, FailResult>,
): APIGatewayProxyHandler => {

    return verifier.warpAPIGateWayProxyHandler(async (
        event: VerifiedAPIGatewayProxyEvent,
        _context: Context,
    ) => {

        const body: SudoRPCCall<Metadata, Payload> = event.verifiedBody;

        const executeResult: SudoRPCReturn<SuccessResult, FailResult> =
            await service.execute(body);

        const responseCode: HTTP_RESPONSE_CODE =
            await Promise.resolve(responseCodeMaker(executeResult));

        return createLambdaResponse(responseCode, executeResult);
    });
};
