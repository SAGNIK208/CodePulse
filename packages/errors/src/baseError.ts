class BaseError extends Error{
    public status: string | number;
    public description: Record<string, any>;
    constructor(name:string,status:string|number,message:string,description:Record<string, any>){
        super(message);
        this.name = name;
        this.status = status;
        this.description = description;
    }
}

export default BaseError;