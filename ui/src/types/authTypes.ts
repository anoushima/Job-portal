export type RegisterFormData={
    first_name:string;
    last_name:string;
    username:string;
    email:string;
    password:string;
    role:string;
};

export type LoginResponse={
    access:string;
    refresh:string;
    role:string;
};