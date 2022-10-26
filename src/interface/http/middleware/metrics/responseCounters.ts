import { Container } from "@type/core";
import { Summary } from "prom-client";
import ResponseTime from "response-time";

export default (coreContainer: Container)=>{
    const excludeUrl = coreContainer.systemUseCase.metricExcludeUrl();
    const responses = new Summary({  
        name: "responses",
        help: "Tempo de resposta em milliseconds",
        labelNames: ["method", "path", "statusCode"]
    });
    
    return ResponseTime((req, res, time) =>{  
        if(!excludeUrl.includes(req.path)) {
            responses.labels(req.method, req.url, res.statusCode).observe(time);
        }
    });
};