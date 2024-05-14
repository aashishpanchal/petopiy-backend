import logger from '@repo/logger';
import { config } from '@/config';
import { singleton } from 'tsyringe';
import { defaultsDeep } from 'lodash';
import { ISendMailOptions, mailer } from '../utils';
import { InternalServerError } from '@/lib/errors';

@singleton()
export class Notification {
  async onEmail(sendMailOptions: ISendMailOptions) {
    const verify = await mailer.verify();
    // check connection configuration
    if (!verify)
      throw new InternalServerError('Failed to connect to mail server');
    // add default from email address
    const options = defaultsDeep(sendMailOptions, {
      from: config.SMTP.FROM,
    });
    // if app is dev so console on print user email
    if (config.IS_DEV) logger.info(`Sending mail to ${options.to}`);
    // after send mail, return the result
    return await mailer.sendMail(options);
  }

  async onPhone(to: string, body: string) {
    throw new Error('on Phone method not implemented.');
  }
}
