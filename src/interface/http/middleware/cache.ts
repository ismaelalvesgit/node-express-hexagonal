import { Container } from "@type/core";
import { HttpNext, HttpRequest } from "@type/interface";
import hash from "object-hash";

export interface CacheHandlerParams { 
    path: string
    ctx: Container
    timeExp?: number
}

export const cacheHandler = (params: CacheHandlerParams)=>{
    const { ctx, path, timeExp } = params;
    return async(req: HttpRequest, res: any, next: HttpNext) => {
        const urlCache = hash((req.originalUrl || req.url).replace("/", ":").substring(1));
        const key = path ? path.concat(":", urlCache) : urlCache;
        const data = await ctx.systemUseCase.redis()?.get(key);
        if (data) {
            res.json(data);
        } else {
            res.sendResponse = res.send;
            res.send = (body)=>{
                if(res.statusCode < 400){
                    ctx.systemUseCase.redis()?.set(key, body, timeExp || 600);
                }
                res.sendResponse(body);
            };
            return next();
        }
    };
};