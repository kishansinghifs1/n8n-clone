import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky , {type Options as KyOptions} from "ky";
import Handlebars from "handlebars";

type HttpRequestData = {
    variableName: string;
    endpoint: string;
    body?: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}

export const httpTriggerExecutor : NodeExecutor<HttpRequestData> = async ({ data ,nodeId, context,step }) => {
    if(!data.endpoint){
        throw new NonRetriableError("Endpoint is missing");
    }

    if(!data.variableName){
        throw new NonRetriableError("Variable name is missing");
    }
    
    if(!data.method){
        throw new NonRetriableError("Method is missing");
    }

    const result =  await step.run("http-request",async () => {
        const endpoint = Handlebars.compile(data.endpoint)(context) ;
        const method = data.method;
        const options : KyOptions = {
            method,
        }
        if(["POST","PUT","PATCH"].includes(method)){
            options.body = data.body;
            options.headers = {
                "Content-Type" : "application/json"
            };
        }
        const response = await ky(endpoint,options);
        const contentType = response.headers.get("content-type");
        const responseData = contentType?.includes("application/json") ? await response.json() : await response.text();
        const responsePayload = {
            httpResponse : {
                statusText : response.statusText,
                status : response.status,
                data : responseData
            }
        }
        
        return {
            ...context,
            [data.variableName] : responsePayload
        }

    });
    
    return result;
}