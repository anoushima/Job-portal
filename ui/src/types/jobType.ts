export type CreateJobType = {
  title: string;
  description: string;
  location: string;
  salary: string;
};

export type Job = {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: string;
  applied:boolean
};