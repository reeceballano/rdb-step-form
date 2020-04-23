(function() {
    
    new Vue({
        el: '#app',
        template: ' <div class="form">\
                        <h2>{{ title }}</h2>\
                        <form@submit.prevent="checkStep" class="rdb-form">\
                            <input v-if="!hideForm" v-model="inputValue" ref="regInput" :type="inputType" :placeholder="inputLabel"/>\
                            <span v-else ><input type="submit" value="Send" @click.prevent="submitForm" />\
                            <h3>Click the Send Button</h3>\
                            </span>\
                        </form>\
                    </div>',
        data() {
            return {
                formId: 0,
                appForm: document.getElementById('app'),
                url: `http://wp54.test/wp-json/contact-form-7/v1/contact-forms/`,
                title: '',
                inputValue: '',
                inputLabel: '',
                inputType: '',
                position: 0,
                hideForm: false,
                collectedData: {
                    name: '',
                    email: '',
                    message: ''
                },

                rawDataRegSteps: [],
                registerSteps: [

                ],
                // registerSteps: [
                //     {
                //       label: "What's your first name?",
                //       type: "text",
                //       value: "",
                //       pattern: /.+/
                //     },
                //     {
                //       label: "What's your email?",
                //       type: "text",
                //       value: "",
                //       pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                //     },
                //     {
                //       label: "Your Message",
                //       type: "text",
                //       value: "",
                //       pattern: /.+/
                //     }
                //   ]
            }
        },

        created() {
            this.getFormId();
            this.getFormFields();
        },
        
        mounted() {
            this.setSteps();
        },
        
        methods: {
            // Get the Form Fields
            getFormFields() {
                // Get the fields via data attributes (data-fields)
                const form_fields = JSON.stringify(this.appForm.dataset.fields);
               
                const fields = form_fields.split(',');

                const finalData = [];

                // Loop the data-field
                fields.forEach(item => {
                    // Replace any special char
                    const newItem = item.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");

                    console.log( newItem.split(/(?=[A-Z])/).join(" ") );

                    // Check if there is an email field
                    const checkEmail = newItem.split(/(?=[A-Z])/).join(" ").toLowerCase();

                    if(checkEmail.includes('email')){
                        finalData.push({ label: newItem.split(/(?=[A-Z])/).join(" "), type: 'text', value: '', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })
                    } else {
                        // Push each item in finalData array then separate single word (e.g yourName). final output "your Name"
                        finalData.push({ label: newItem.split(/(?=[A-Z])/).join(" "), type: 'text', value: '', pattern: /.+/ })
                    }

                });

                this.registerSteps = finalData;

            },

            // Get Form Id via Data attributes
            getFormId() {
                const form_id = this.appForm;
                this.formId = JSON.parse(form_id.dataset.id);
            },

            // Set steps
            setSteps() {
                this.inputLabel = this.registerSteps[this.position].label;
                this.inputType = this.registerSteps[this.position].type;
                this.inputValue = this.registerSteps[this.position].value;
            },

            checkPosition() {
                switch(this.position) {
                    case 0:
                        this.collectedData.name = this.inputValue;
                        break;
    
                    case 1:
                        this.collectedData.email = this.inputValue;
                        break;
                    case 2:
                        this.collectedData.message = this.inputValue;  
                }

            },

            setInputValue() {
                this.registerSteps[this.position].value = this.inputValue;
            },

            checkStep() {
                if(!this.registerSteps[this.position].pattern.test(this.inputValue)) {
                    this.$refs.regInput.classList.add('error-input');

                    setTimeout( () => {
                        this.$refs.regInput.classList.remove('error-input');
                    }, 1000);
                } else {
                    this.setInputValue();
                    
                    this.checkPosition();
    
                    if(this.position === this.registerSteps.length - 1) {
                        this.hideForm = true;
                    } else {
                        this.position += 1;
                        this.setSteps();
                    }
                }
            },

            submitForm() {
                console.log('sending form');

                // Create new instance
                let bodyFormData = new FormData();

                // Loop the fields and assign item with the value
                this.registerSteps.forEach(item => {
                    bodyFormData.set(item.label.replace(/\s/g, ''), item.value);
                })

                // Config
                const params = {
                    body: bodyFormData,
                    method: "POST"
                };

                // Send form
                fetch(`${this.url}${this.formId}/feedback`, params)
                        .then( response => response.json())
                        .then( data => console.log('Success:', data.status))
                        .catch(error => console.log('Error:', error));

            }
        }
    });
})();