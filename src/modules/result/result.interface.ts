type Grade = 'A_PLUS'|'A'|'A_MINUS'|'B_PLUS'|'B'|'B_MINUS'|'C_PLUS'|'C'|'D'|'F'


export interface IResult {
  enrollmentId:string;
  marks:number;
  grade:Grade;
  gradePoint:number;
}