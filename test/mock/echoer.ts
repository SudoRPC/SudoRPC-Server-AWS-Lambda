/**
 * @author WMXPY
 * @namespace Service
 * @description Echoer
 * @override Mock
 */

import { SudoRPCEndpointHandlerHelper, SudoRPCEndpointResource, SudoRPCEndpointResourceHandlerReturn, SudoRPCHandlerContext, SudoRPCService } from "@sudorpc/core";

export const createEchoerService = (): SudoRPCService<any, any, any, any> => {

    const service: SudoRPCService<any, any, any, any> = SudoRPCService.create("echoer");

    service.register(
        SudoRPCEndpointResource.create("echo", (
            context: SudoRPCHandlerContext<any, any>,
            helper: SudoRPCEndpointHandlerHelper<any, any, any, any>,
        ): SudoRPCEndpointResourceHandlerReturn<any, any> => {

            return helper.createSuccessReturn(
                {
                    echo: context.payload,
                },
            );
        }, {
            exposed: true,
        }),
    );

    return service;
};
