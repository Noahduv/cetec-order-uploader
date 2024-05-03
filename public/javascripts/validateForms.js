(function() {
    'use-strict'
    const forms = document.querySelectorAll('.validated-form')
    Array.from(forms).forEach(function (form) {
        form.addEventListener('submit', function(event) {
            if(!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
                alert("File Must be a .csv");
            }
            form.classList.add('was-validated')
        }, false)
    })
    }) ()