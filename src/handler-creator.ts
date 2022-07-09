/**
 * @author WMXPY
 * @namespace AWSLambda
 * @description Handler Creator
 */

import { createAnyPattern, Pattern } from "@sudoo/pattern";
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

    private _metadataPattern: Pattern = createAnyPattern();
    private _payloadPattern: Pattern = createAnyPattern();

    private constructor(
        service: SudoRPCService<Metadata, Payload, SuccessResult, FailResult>,
    ) {

        this._service = service;
    }

    public withMetadataPattern(pattern: Pattern): this {

        this._metadataPattern = pattern;
        return this;
    }

    public withPayloadPattern(pattern: Pattern): this {

        this._payloadPattern = pattern;
        return this;
    }

    public createAPIGatewayHandler(
        responseCodeMaker: APIGatewayResponseCodeMaker<SuccessResult, FailResult> =
            DefaultResponseCodeMaker,
    ): APIGatewayProxyHandler {

        return createSudoRPCServerAWSLambdaAPIGatewayHandler(
            this._service,
            this._metadataPattern,
            this._payloadPattern,
            responseCodeMaker,
        );
    }
}
