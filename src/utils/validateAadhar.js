function validateAadhar(aadhar) {
  var regexp = /^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/;
  if (regexp.test(aadhar)) {
    return true;
  } else {
    return false;
  }
}

module.exports = validateAadhar;
