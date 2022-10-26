import { HttpNext, HttpRequest, HttpResponse } from "@type/interface";

export default (req: HttpRequest, res: HttpResponse, next: HttpNext)=>{
    const locale = (req.query.lang || req.header("accept-language")) as string;
    if(locale){
        req.setLocale(locale);
        res.setLocale(locale);
    }
    next();
};