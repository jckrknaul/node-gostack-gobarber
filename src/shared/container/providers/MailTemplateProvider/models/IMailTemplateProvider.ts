import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplate {
  parse(data: IParseMailTemplateDTO): Promise<string>;
}
