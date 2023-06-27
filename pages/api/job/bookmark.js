import {connectDBJobPortal} from '@/DB/DbJobProtal';
import validateToken from '@/middleware/tokenValidation';
import BookMarkJob from '@/models/Bookmark';
import Joi from 'joi';

export const config = {
    api: {
        externalResolver: true,
        bodyParser: false,
    },
};

const schema = Joi.object({
    user: Joi.required(),
    job: Joi.required(),
});


export default async function handler (req, res) {
    await connectDBJobPortal();

    switch (req.method) {
        case "POST":
            await validateToken(req, res, async () => {
                await bookmark_job(req, res);
            });
            break;
        case "GET":
            await validateToken(req, res, async () => {
                await getBookmark_jobs(req, res);
            });
            break;
        case "DELETE":
            await validateToken(req, res, async () => {
                await delete_bookmark_job(req, res);
            });
            break;
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}



export const bookmark_job = async (req, res) => {
    console.log('req.body => ', req.body);
    const {job_id, user_id} = req.body;
   

    console.log('job => ', job_id);
    console.log('user => ', user_id);

    const { error } = schema.validate({ job_id, user_id });

    if (error) return res.status(401).json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

    try {
        const checkAlreadyBookMarked = await BookMarkJob.findOne({ job_id, user_id })
        if (checkAlreadyBookMarked) return res.status(401).json({ success: false, message: "This Job is Already in Bookmark" })

        const bookmarkingJob = await BookMarkJob.create({ job_id, user_id });
        return res.status(200).json({ success: true, message: "Job Bookmarked successfully !" })
    } catch (error) {
        console.log('Error in booking marking a job (server) => ', error);
        return res.status(500).json({ success: false, message: "Something Went Wrong Please Retry login !" })
    }
}


export const getBookmark_jobs = async (req, res) => {
    const userId = req.query.id;

    if (!userId) return res.status(400).json({ success: false, message: "Please Login" })
    try {
        const getBookMark = await BookMarkJob.find({ user: userId }).populate('job').populate('user')
        return res.status(200).json({ success: true, message: "Job Bookmarked successfully !", data: getBookMark })
    } catch (error) {
        console.log('Error in getting book mark Job (server) => ', error);
        return res.status(500).json({ success: false, message: "Something Went Wrong Please Retry Later !" })
    }
}



export const delete_bookmark_job = async (req, res) => {
    const id = req.body;
    if (!id) return res.status(400).json({ success: false, message: "Please Login" })
    try {

        const deleteBookmark = await BookMarkJob.findByIdAndDelete(id)
        return res.status(200).json({ success: true, message: "Job removed successfully !" })
    } catch (error) {
        console.log('Error in deleting book mark Job (server) => ', error);
        return res.status(500).json({ success: false, message: "Something Went Wrong Please Retry Later !" })
    }
}
