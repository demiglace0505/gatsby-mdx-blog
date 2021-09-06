### Collect Form Values in Netlify

The following has to be added in the form and input properties in order to enable Netlify form collection

```jsx
          <form
            action="/success"
            className="contact-form"
            name="mdx-contact"
            method="post"
            netlify-honeypot="bot-field"
            data-netlify="true"
          >
            <input type="hidden" name="bot-field" />
            <input type="hidden" name="form-name" value="mdx-contact" />
```
