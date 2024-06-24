export {};
declare global{
     interface IBackendRes<T> {
        code:number,
        message:string,
        data:T
     }
}