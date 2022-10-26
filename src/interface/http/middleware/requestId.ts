import { HttpNext, HttpRequest, HttpResponse } from "@type/interface";
import { v4 as uuidv4 } from "uuid";

export default (req: HttpRequest, res: HttpResponse, next: HttpNext) => {
    const requestId = (req.query.requestId || req.headers["requestId"] || uuidv4()) as string;
    req.requestId = requestId;
    req.headers["requestId"] = requestId;
    return next();
};