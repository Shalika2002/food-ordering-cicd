const bcrypt = require('bcrypt');

async function hashPassword() {
    const plainPassword = 'SecurePass123!';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log('Plain password:', plainPassword);
    console.log('Hashed password:', hashedPassword);
    
    // Test the comparison
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('Password match test:', isMatch);
}

hashPassword().catch(console.error);