/**
 * @author WMXPY
 * @namespace AWSLambda_Declare
 * @description API Gateway
 */

import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { SudoRPCReturn } from "@sudorpc/core";

export type APIGatewayResponseCodeMaker<SuccessResult, FailResult> = (
    returns: SudoRPCReturn<SuccessResult, FailResult>
) => Promise<HTTP_RESPONSE_CODE> | HTTP_RESPONSE_CODE;

export const DefaultResponseCodeMaker: APIGatewayResponseCodeMaker<any, any> = (
    returns: SudoRPCReturn<any, any>,
) => {

    if (returns.success) {
        return HTTP_RESPONSE_CODE.OK;
    }
    return HTTP_RESPONSE_CODE.BAD_REQUEST;
};
