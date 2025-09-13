import {scryptSync} from "node:crypto";
 const salt = 'syldisr?*fe';
// Function to hash a password
export const  hashPassword = (password) => {
  // Generate a random salt (16 bytes)
  // const salt = crypto.randomBytes(16).toString("hex");
  // Use scrypt for password hashing (recommended)
  const hash = scryptSync(password, salt, 64).toString("hex");

  // Return both salt and hash for storage
  return hash;
}

// Function to verify a password
export const verifyPassword = (password,  hash)=> {
  const hashedPassword = scryptSync(password, salt, 64).toString(
    "hex"
  );
  return hashedPassword === hash;
}


export const RandomId = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// // Example usage
// const password = 'mySecurePassword';

// // Hash the password for storage
// const { salt, hash } = hashPassword(password);
// console.log('Salt:', salt);
// console.log('Hash:', hash);

// // Verify a login attempt
// const isValid = verifyPassword(password, salt, hash);
// console.log('Password valid:', isValid); // true

// const isInvalid = verifyPassword('wrongPassword', salt, hash);
// console.log('Wrong password valid:', isInvalid); // false
