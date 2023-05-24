import logging
import mimetypes
import hashlib

from confy import env

import six
from django.conf import settings
from django.core.mail import EmailMultiAlternatives, EmailMessage

from django.template import loader, Template
from django.utils.encoding import smart_text
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)


def _render(template, context):
    if isinstance(context, dict):
        context.update({'settings': settings})
    if isinstance(template, six.string_types):
        template = Template(template)
    return template.render(context)

class TemplateEmailBase(object):
    subject = ''
    html_template = 'wagov_utils/emails/base_email.html'
    # txt_template can be None, in this case a 'tag-stripped' version of the html will be sent. (see send)
    txt_template = 'wagov_utils/emails/base-email.txt'

    def __init__(self, subject='', html_template='', txt_template=''):
        # Update
        self.subject = subject if subject else self.subject
        self.html_template = html_template if html_template else self.html_template
        self.txt_template = txt_template if txt_template else self.txt_template

    def send_to_user(self, user, context=None):
        return self.send(user.email, context=context)

    def send(self, to_addresses, from_address=None, context=None, attachments=None, cc=None, bcc=None):
        """
        Send an email using EmailMultiAlternatives with text and html.
        :param to_addresses: a string or a list of addresses
        :param from_address: if None the settings.DEFAULT_FROM_EMAIL is used
        :param context: a dictionary or a Context object used for rendering the templates.
        :param attachments: a list of (filepath, content, mimetype) triples
               (see https://docs.djangoproject.com/en/1.9/topics/email/)
               or Documents
        :param bcc:
        :param cc:
        :return:
        """
        email_instance = env('EMAIL_INSTANCE','DEV')
        # The next line will throw a TemplateDoesNotExist if html template cannot be found
        html_template = loader.get_template(self.html_template)
        # render html
        html_body = _render(html_template, context)
        if self.txt_template is not None:
            txt_template = loader.get_template(self.txt_template)
            txt_body = _render(txt_template, context)
        else:
            txt_body = strip_tags(html_body)

        # build message
        if isinstance(to_addresses, six.string_types):
            to_addresses = [to_addresses]
        if attachments is None:
            attachments = []
        if attachments is not None and not isinstance(attachments, list):
            attachments = list(attachments)

        if attachments is None:
            attachments = []

        # Convert Documents to (filename, content, mime) attachment
        _attachments = []
        for attachment in attachments:
            if isinstance(attachment, Document):
                filename = str(attachment)
                content = attachment.file.read()
                mime = mimetypes.guess_type(attachment.filename)[0]
                _attachments.append((filename, content, mime))
            else:
                _attachments.append(attachment)
        msg = EmailMultiAlternatives(self.subject, txt_body, from_email=from_address, to=to_addresses,
                attachments=_attachments, cc=cc, bcc=bcc, 
                headers={'System-Environment': email_instance}
                )
        msg.attach_alternative(html_body, 'text/html')
        try:            
            msg.send(fail_silently=False)            
            return msg
        except Exception as e:
            logger.exception("Error while sending email to {}: {}".format(to_addresses, e))
            return None
