/**
 * @author WMXPY
 * @namespace AWSLambda
 * @description Handler Creator
 */

import { SudoRPCService } from "@sudorpc/core";
import { APIGatewayProxyHandler } from "aws-lambda";
import { APIGatewayResponseCodeMaker, DefaultResponseCodeMaker } from "./declare/api-gateway";
import { createSudoRPCServerAWSLambdaAPIGatewayHandler } from "./handler/api-gateway";

export class SudoRPCServerAWSLambdaHandlerCreator<Metadata, Payload, SuccessResult, FailResult> {

    public static create<Metadata, Payload, SuccessResult, FailResult>(
        service: SudoRPCService<Metadata, Payload, SuccessResult, FailResult>,
    ): SudoRPCServerAWSLambdaHandlerCreator<Metadata, Payload, SuccessResult, FailResult> {

        return new SudoRPCServerAWSLambdaHandlerCreator(service);
    }

    private readonly _service: SudoRPCService<Metadata, Payload, SuccessResult, FailResult>;

    private constructor(
        service: SudoRPCService<Metadata, Payload, SuccessResult, FailResult>,
    ) {

        this._service = service;
    }

    public createAPIGatewayHandler(
        responseCodeMaker: APIGatewayResponseCodeMaker<SuccessResult, FailResult> =
            DefaultResponseCodeMaker,
    ): APIGatewayProxyHandler {

        return createSudoRPCServerAWSLambdaAPIGatewayHandler(
            this._service,
            responseCodeMaker,
        );
    }
}
