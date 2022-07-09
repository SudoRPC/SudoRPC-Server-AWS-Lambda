/**
 * @author WMXPY
 * @namespace Handler
 * @description API Gateway
 * @override Unit Test
 */

import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { createAnyPattern } from "@sudoo/pattern";
import { SudoRPCCall, SudoRPCService } from "@sudorpc/core";
import { expect } from "chai";
import * as Chance from "chance";
import { createSudoRPCServerAWSLambdaAPIGatewayHandler } from "../../../src";
import { DefaultResponseCodeMaker } from "../../../src/declare/api-gateway";
import { createEchoerService } from "../../mock/echoer";

describe('Given [createSudoRPCServerAWSLambdaAPIGatewayHandler] Helper Methods', (): void => {

    const chance: Chance.Chance = new Chance('handler-api-gateway');

    it('should be able to handle call for echoer', async (): Promise<void> => {

        const service: SudoRPCService<any, any, any, any> = createEchoerService();
        const handler = createSudoRPCServerAWSLambdaAPIGatewayHandler(
            service,
            createAnyPattern(),
            createAnyPattern(),
            DefaultResponseCodeMaker,
        );

        const identifier: string = chance.string();
        const call: SudoRPCCall<any, any> = {

            version: '1.0',
            resource: 'echo',
            identifier,
            metadata: {},
            payload: {},
        };

        const result = await handler({

            path: '/',
            httpMethod: 'POST',
            pathParameters: {},
            queryStringParameters: {},
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            stageVariables: {},
            requestContext: null as any,
            resource: null as any,
            headers: {},
            isBase64Encoded: false,
            body: JSON.stringify(call),
        }, null as any, null as any);

        expect(result).to.be.deep.equal({

            statusCode: HTTP_RESPONSE_CODE.OK,
            body: JSON.stringify({
                version: '1.0',
                identifier,
                success: true,
                result: {
                    echo: {},
                },
            }),
        });
    });

    it('should be able to handle call for echoer - invalid call', async (): Promise<void> => {

        const service: SudoRPCService<any, any, any, any> = createEchoerService();
        const handler = createSudoRPCServerAWSLambdaAPIGatewayHandler(
            service,
            createAnyPattern(),
            createAnyPattern(),
            DefaultResponseCodeMaker,
        );

        const call: SudoRPCCall<any, any> = {
        } as any;

        const result = await handler({

            path: '/',
            httpMethod: 'POST',
            pathParameters: {},
            queryStringParameters: {},
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            stageVariables: {},
            requestContext: null as any,
            resource: null as any,
            headers: {},
            isBase64Encoded: false,
            body: JSON.stringify(call),
        }, null as any, null as any);

        expect(result).to.be.deep.equal({

            statusCode: HTTP_RESPONSE_CODE.BAD_REQUEST,
            body: JSON.stringify(`[Sudoo-Lambda-Verify] Invalid Body, Invalid Value of [version]; Should be "1.0"; But got "undefined"`),
        });
    });

    it('should be able to handle call for echoer - invalid call resource', async (): Promise<void> => {

        const service: SudoRPCService<any, any, any, any> = createEchoerService();
        const handler = createSudoRPCServerAWSLambdaAPIGatewayHandler(
            service,
            createAnyPattern(),
            createAnyPattern(),
            DefaultResponseCodeMaker,
        );

        const identifier: string = chance.string();
        const call: SudoRPCCall<any, any> = {

            version: '1.0',
            resource: 'echo-not-exist',
            identifier,
            metadata: {},
            payload: {},
        };

        const result = await handler({

            path: '/',
            httpMethod: 'POST',
            pathParameters: {},
            queryStringParameters: {},
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            stageVariables: {},
            requestContext: null as any,
            resource: null as any,
            headers: {},
            isBase64Encoded: false,
            body: JSON.stringify(call),
        }, null as any, null as any);

        expect(result).to.be.deep.equal({

            statusCode: HTTP_RESPONSE_CODE.BAD_REQUEST,
            body: JSON.stringify({
                version: '1.0',
                identifier,
                success: false,
                errors: [{
                    isInternalError: true,
                    error: "[SudoRPC] Resource Not Found",
                    message: "Resource echo-not-exist not found",
                }],
            }),
        });
    });
});
