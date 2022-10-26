import { HttpNext, HttpRequest, HttpResponse } from "@type/interface";

const catchAsync = (fn) => (req: HttpRequest, res: HttpResponse, next: HttpNext) => {
    /* eslint-disable no-undef*/
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export default catchAsync;