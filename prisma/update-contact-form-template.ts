import { PrismaClient, BlockCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Updating Contact Form block template...');

    const updated = await prisma.blockTemplate.updateMany({
        where: {
            slug: 'contact-form',
        },
        data: {
            description: 'Advanced contact form with customizable fields, validation, and spam protection',
            defaultConfig: {
                heading: 'Get in touch',
                subheading: '',
                description: 'Fill out the form below and we\'ll get back to you as soon as possible.',
                buttonText: 'Send Message',
                successMessage: 'Thank you for contacting us. We\'ll get back to you as soon as possible.',
                backgroundColor: '',
                showHoneypot: true,
                fields: [
                    { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Your name' },
                    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'your@email.com' },
                    { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Your message', rows: 5 },
                ],
            },
            configSchema: {
                fields: [
                    { 
                        name: 'heading', 
                        type: 'text', 
                        label: 'Heading', 
                        required: true,
                        default: 'Get in touch',
                        placeholder: 'Form heading'
                    },
                    { 
                        name: 'subheading', 
                        type: 'text', 
                        label: 'Subheading',
                        placeholder: 'Optional subheading'
                    },
                    { 
                        name: 'description', 
                        type: 'textarea', 
                        label: 'Description',
                        rows: 3,
                        placeholder: 'Form description text'
                    },
                    { 
                        name: 'buttonText', 
                        type: 'text', 
                        label: 'Button Text', 
                        required: true,
                        default: 'Send Message'
                    },
                    { 
                        name: 'successMessage', 
                        type: 'textarea', 
                        label: 'Success Message',
                        rows: 2,
                        placeholder: 'Message shown after successful submission'
                    },
                    { 
                        name: 'backgroundColor', 
                        type: 'color', 
                        label: 'Background Color',
                        description: 'Background color for the form section'
                    },
                    { 
                        name: 'showHoneypot', 
                        type: 'checkbox', 
                        label: 'Enable Spam Protection',
                        description: 'Adds a hidden honeypot field to prevent spam',
                        default: true
                    },
                    {
                        name: 'fields',
                        type: 'repeater',
                        label: 'Form Fields',
                        itemLabel: 'Field',
                        description: 'Configure the form fields',
                        fields: [
                            {
                                name: 'name',
                                type: 'text',
                                label: 'Field Name',
                                required: true,
                                placeholder: 'e.g., name, email, phone',
                                description: 'Unique identifier (lowercase, no spaces)'
                            },
                            {
                                name: 'label',
                                type: 'text',
                                label: 'Field Label',
                                required: true,
                                placeholder: 'Display label'
                            },
                            {
                                name: 'type',
                                type: 'select',
                                label: 'Field Type',
                                required: true,
                                options: [
                                    { value: 'text', label: 'Text' },
                                    { value: 'email', label: 'Email' },
                                    { value: 'tel', label: 'Phone' },
                                    { value: 'textarea', label: 'Textarea' },
                                    { value: 'select', label: 'Select Dropdown' },
                                    { value: 'checkbox', label: 'Checkbox' },
                                    { value: 'number', label: 'Number' },
                                ],
                                default: 'text'
                            },
                            {
                                name: 'required',
                                type: 'checkbox',
                                label: 'Required',
                                default: false
                            },
                            {
                                name: 'placeholder',
                                type: 'text',
                                label: 'Placeholder',
                                placeholder: 'Placeholder text'
                            },
                            {
                                name: 'helpText',
                                type: 'text',
                                label: 'Help Text',
                                placeholder: 'Helper text shown below field'
                            },
                            {
                                name: 'minLength',
                                type: 'number',
                                label: 'Min Length',
                                placeholder: 'Minimum characters'
                            },
                            {
                                name: 'maxLength',
                                type: 'number',
                                label: 'Max Length',
                                placeholder: 'Maximum characters'
                            },
                            {
                                name: 'pattern',
                                type: 'text',
                                label: 'Validation Pattern (Regex)',
                                placeholder: 'e.g., ^[A-Za-z]+$',
                                description: 'Optional regex pattern for validation'
                            },
                            {
                                name: 'rows',
                                type: 'number',
                                label: 'Rows (Textarea only)',
                                placeholder: 'Number of rows',
                                default: 5
                            },
                            {
                                name: 'options',
                                type: 'repeater',
                                label: 'Options (Select only)',
                                itemLabel: 'Option',
                                description: 'Options for select dropdown',
                                fields: [
                                    {
                                        name: 'value',
                                        type: 'text',
                                        label: 'Value',
                                        required: true,
                                        placeholder: 'option-value'
                                    },
                                    {
                                        name: 'label',
                                        type: 'text',
                                        label: 'Label',
                                        required: true,
                                        placeholder: 'Display Label'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
        },
    });

    console.log(`✅ Updated ${updated.count} contact form template(s)`);
    console.log('📝 Please refresh your page builder to see the new configuration options');
}

main()
    .catch((e) => {
        console.error('❌ Error updating template:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });








