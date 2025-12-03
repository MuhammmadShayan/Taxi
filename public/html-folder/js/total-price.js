// get reference to element containing checkboxContainPrice checkboxes
//var el = document.getElementById('checkboxContainPrice');

// get reference to input elements in checkboxContainPrice container element
//var tops = el.getElementsByTagName('input');

// assign function to onclick property of each checkbox
// for (var i=0, len=tops.length; i<len; i++) {
//     if ( tops[i].type === 'checkbox' ) {
//         tops[i].onclick = function() {
//             // put your awesome code here
//             alert('this tis working')
//         }
//     }
// }

// call onload or in script segment below form
function attachCheckboxHandlers() {
    // get reference to element containing checkboxContainPrice checkboxes
    var el = document.getElementById('checkboxContainPrice');
    
    // Add null check to prevent errors
    if (!el) {
        console.warn('Element with ID "checkboxContainPrice" not found');
        return;
    }

    // get reference to input elements in checkboxContainPrice container element
    var tops = el.getElementsByTagName('input');
    
    if (!tops || tops.length === 0) {
        console.warn('No input elements found in checkboxContainPrice container');
        return;
    }

    // assign updateTotal function to onclick property of each checkbox
    for (var i=0, len=tops.length; i<len; i++) {
        if ( tops[i] && tops[i].type === 'checkbox' ) {
            tops[i].onclick = updateTotal;
        }
    }
}

// called onclick of checkboxContainPrice checkboxes
function updateTotal(e) {
    // 'this' is reference to checkbox clicked on
    if (!this || !this.form) {
        console.warn('Invalid checkbox element or form not found');
        return;
    }
    
    var form = this.form;
    
    // Check if total element exists
    if (!form.elements['total']) {
        console.warn('Total element not found in form');
        return;
    }

    // get current value in total text box, using parseFloat since it is a string
    var val = parseFloat( form.elements['total'].value );
    
    // Handle NaN values
    if (isNaN(val)) {
        val = 0;
    }

    // if check box is checked, add its value to val, otherwise subtract it
    if ( this.checked ) {
        val += parseFloat(this.value) || 0;
    } else {
        val -= parseFloat(this.value) || 0;
    }

    // format val with correct number of decimal places
    // and use it to update value of total text box
    form.elements['total'].value = formatDecimal(val);
}

// format val to n number of decimal places
// modified version of Danny Goodman's (JS Bible)
function formatDecimal(val, n) {
    n = n || 2;
    var str = "" + Math.round ( parseFloat(val) * Math.pow(10, n) );
    while (str.length <= n) {
        str = "0" + str;
    }
    var pt = str.length - n;
    return str.slice(0,pt) + "." + str.slice(pt);
}

// in script segment below form
attachCheckboxHandlers();