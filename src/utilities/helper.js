import fs from 'fs';

const randomString = length => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const len = chars.length;
    let random = '';
    for (let i = 0; i < length; i++) {
        const posN = Math.ceil(Math.random() * (len - 1));
        random += chars[posN];
    }

    return random;
}

const deleteFile = filePath => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
    }
}

export {randomString, deleteFile};