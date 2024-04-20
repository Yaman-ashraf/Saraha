import multer from 'multer';
import { nanoid } from 'nanoid';
function fileUploadPdf() {
    const storage = multer.diskStorage({});

    function fileFilter(req, file, cb) {
        if (['application/pdf'].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb("invalid format", false);
        }
    }

    const upload = multer({ fileFilter, storage });
    return upload;

}
export default fileUploadPdf; 