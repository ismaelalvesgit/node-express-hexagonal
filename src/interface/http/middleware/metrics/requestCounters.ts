import { Container } from "@type/core";
import { HttpNext, HttpRequest, HttpResponse } from "@type/interface";
import { Counter } from "prom-client";

export default (coreContainer: Container)=>{
    const excludeUrl = coreContainer.systemUseCase.metricExcludeUrl();
    const numOfRequests = new Counter({
        name: "numOfRequests",
        help: "Quantidade de requisições",
        labelNames: ["method"]
    });
    const pathsTaken = new Counter({  
        name: "pathsTaken",
        help: "Caminhos percorridos na aplicação",
        labelNames: ["path"]
    });

    return (req: HttpRequest, res: HttpResponse, next: HttpNext) => {
        if(!excludeUrl.includes(req.path)) {
            numOfRequests.inc({ method: req.method });
            pathsTaken.inc({ path: req.path });
        }
        return next();
    };
};