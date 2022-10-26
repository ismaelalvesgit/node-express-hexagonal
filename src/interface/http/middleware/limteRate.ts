import { ServiceUnavailable } from "@util/error";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./errorHandler";

export default (time = 5 * 60 * 1000, max = 5)=>{
    return rateLimit({  
        windowMs: time,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        handler:  (request, response, next)=>{
            errorHandler(new ServiceUnavailable("throttling"), request, response, next);
        }
    });
};