export class ResponseDto<Model> {
    data: Model | Array<Model>;
    statusCode: number;
    message: string;
}
