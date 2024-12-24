const Sem = require('../models/semesterModel')
const cloudinary = require('cloudinary')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const ErrorHandler = require('../utils/ErrorHandler')
const { ValidateSubject, ValidateChapter, setLikeUnlike } = require('./validator')
const ApiFeatures = require('../utils/apiFeatures')
const getDataUri = require('../utils/dataUri')
const getSentimentPrediction = require('../sentimentAnalysis/predict')

//Create semester along with their subject --- (Admin)
exports.createSem = catchAsyncErrors(async (req, res, next) => {
    const { sem, subject, code, description, passMarks, fullMarks, courseDes, courseObj, refBooks, txtBooks, labWorks } = req.body;
    const smst = await Sem.create({
        semester: sem, subject, description, code, syllabus:
        {
            fullMarks, passMarks, courseDescription: courseDes, courseObjective: courseObj, referenceBooks: refBooks,
            textBook: txtBooks, labWorks
        }
    });

    res.status(200).json({
        success: true,
        smst
    })
})

//Get all semesters details
exports.getAllSemesters = catchAsyncErrors(async (req, res, next) => {

    if (req.query.keyword) {
        const apiFeatures = new ApiFeatures(Sem.find(), req.query, "note").filter();

        const filteredNote = await apiFeatures.query;

        const filteredNotesCount = filteredNote.length;

        res.status(200).json({
            success: true,
            filteredNote,
            filteredNotesCount
        })
    } else {
        const semesters = await Sem.find();

        const firstSem = semesters.filter(sem => sem.semester === "first");
        const secondSem = semesters.filter(sem => sem.semester === "second");
        const thirdSem = semesters.filter(sem => sem.semester === "third");
        const fourthSem = semesters.filter(sem => sem.semester === "fourth");
        const fifthSem = semesters.filter(sem => sem.semester === "fifth");
        const sixthSem = semesters.filter(sem => sem.semester === "sixth");
        const seventhSem = semesters.filter(sem => sem.semester === "seventh");
        const eightSem = semesters.filter(sem => sem.semester === "eight");

        const arr = [{
            name: "First",
            subCount: firstSem.length || 0,
        }, {
            name: "Second",
            subCount: secondSem.length || 0,
        }, {
            name: "Third",
            subCount: thirdSem.length || 0,
        }, {
            name: "Fourth",
            subCount: fourthSem.length || 0,
        }, {
            name: "Fifth",
            subCount: fifthSem.length || 0,
        }, {
            name: "Sixth",
            subCount: sixthSem.length || 0,
        }, {
            name: "Seventh",
            subCount: seventhSem.length || 0,
        }, {
            name: 'Eight',
            subCount: eightSem.length || 0
        }]
        res.status(200).json({
            success: true,
            semesters: arr
        })
    }
})

//Get all subjects of specific semester 
exports.getAllSubjects = catchAsyncErrors(async (req, res, next) => {
    const semester = req.params.level;
    const resultPerPage = 5;
    const { page } = req.query

    //findOne => returns single document on match otherwise null 
    const subjects = await Sem.find({ semester }); //find => returns array of documents on match otherwise empty array     
    const totalSub = subjects.length

    if (Number(page) > 0 && totalSub > resultPerPage) {
        let filteredSub = [];
        let count = 0;
        for (let i = ((page - 1) * resultPerPage); count < resultPerPage; i++) {
            if (i >= totalSub) break;
            filteredSub.push(subjects[i]);
            count++;
        }
        subjects = filteredSub
    }

    res.status(200).json({
        success: true,
        subjects,
        totalSub,
        resultPerPage
    })
})

//Get a subject details
exports.getSubjectDetails = catchAsyncErrors(async (req, res, next) => {
    const semester = req.params.level;
    const subject = req.params.sub;
    const check = {
        error: false
    }

    const result = await ValidateSubject(Sem, check, semester, subject, next)
    if (check.error) return;

    res.status(200).json({
        success: true,
        result
    })
})

//Update subject of specific semester --- (Admin)
exports.updateSubject = catchAsyncErrors(async (req, res, next) => {
    const semester = req.params.level;
    const subject = req.params.sub;
    const check = {
        error: false
    }

    //check if the subject exist
    await ValidateSubject(Sem, check, semester, subject, next)
    if (check.error) return;
    const { sub, code, des, syllabus } = req.body;
    const newSubject = {
        subject: sub,
        code: code,
        description: des,
        syllabus: {
            fullMarks: syllabus.fullMarks, passMarks: syllabus.fullMarks, courseDescription: syllabus.courseDes, courseObjective: syllabus.courseObj,
            referenceBooks: syllabus.refBooks, textBook: syllabus.txtBooks, labWorks: syllabus.labWorks
        }
    }
    const result = await Sem.findOneAndUpdate({ semester, subject }, newSubject, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        result
    })
})

//Delete a subject --- (Admin)
exports.deleteSubject = catchAsyncErrors(async (req, res, next) => {
    const details = {
        semester: req.params.level,
        subject: req.params.sub
    }
    const check = {
        error: false
    }

    //check if the subject exist
    await ValidateSubject(Sem, check, details.semester, details.subject, next)
    if (check.error) return;
    const prefixPaths = [
        `Semester/${details.semester}/chapters/${details.subject}/`,
        `Semester/${details.semester}/questions/${details.subject}/`,
        `Semester/${details.semester}/questionBank/${details.subject}/`
    ];

    try {
        for (const prefixPath of prefixPaths) {
            // List all resources (assets) in the folder
            const { resources } = await cloudinary.api.resources({
                type: 'upload',
                prefix: prefixPath,
                max_results: 500,
            });

            // Filter resources strictly within the folder (ignoring subfolders)
            const filteredResources = resources.filter(resource => {
                return resource.public_id.startsWith(prefixPath) &&
                    !resource.public_id.slice(prefixPath.length).includes('/');
            });

            const publicIds = filteredResources.map(resource => resource.public_id);

            if (publicIds.length > 0) {
                // Delete all the assets in the exact folder
                await cloudinary.api.delete_resources(publicIds);
            } else {
                console.log('No assets found in the folder:', prefixPath);
            }

            try {
                await cloudinary.api.delete_folder(prefixPath);
            } catch (error) {
                console.error('Error deleting folder:', prefixPath, error);
            }
        }
    } catch (error) {
        console.error('Error deleting assets:', error);
    }



    await Sem.deleteOne(details);

    res.status(200).json({
        success: true,
        message: "Subject deleted successfully"
    })
})

//Get a chapter details
exports.getChapterDetails = catchAsyncErrors(async (req, res, next) => {
    const semester = req.params.level;
    const subject = req.params.sub;
    const chapter = req.params.ch;
    const check = {
        error: false
    }

    const sub = await ValidateSubject(Sem, check, semester, subject, next)
    if (check.error) return;


    const res_chapter = await ValidateChapter(sub, check, chapter, next)
    if (check.error) return;

    res.status(200).json({
        success: true,
        res_chapter
    })
})


//Add a chapters --- (Admin)
exports.addChapter = catchAsyncErrors(async (req, res, next) => {
    const semester = req.params.level;
    const subject = req.params.sub;

    const check = {
        error: false
    }

    const data = await ValidateSubject(Sem, check, semester, subject, next)
    if (check.error) return;

    //check if chapter already exist
    const isChapExist = data && data.chapters.find((ch) => ch.name.toString() === req.body.name.toString());

    if (isChapExist)
        return next(new ErrorHandler("Chapter already exist", 400));

    //check if chapter number already exist
    const isChapNumExist = data && data.chapters.find((ch) => ch.number.toString() === req.body.number.toString());

    if (isChapNumExist) {
        return next(new ErrorHandler("Chapter number already exists", 400)); //bad request => 404
    }

    const file = req.files['file'][0];
    const fileUri = getDataUri(file)

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
        public_id: file.originalname.split('.')[0],
        folder: `Semester/${semester}/chapters/${subject}`,
    });

    const chapters = {
        name: req.body.name,
        number: req.body.number,
        creditHrs: req.body.creditHrs,
        file: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        },
        provider: req.body.provider,
        topic: req.body.topic
    }

    const result = await Sem.findOneAndUpdate({ semester, subject }, { $push: { chapters: chapters } }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        result
    })
})

//Delete a chapter --- (Admin)
exports.deleteChapter = catchAsyncErrors(async (req, res, next) => {
    const semester = req.params.level;
    const subject = req.params.sub;
    const chapter = req.params.ch;
    const check = {
        error: false
    }

    const sub = await ValidateSubject(Sem, check, semester, subject, next)
    if (check.error) return;

    await ValidateChapter(sub, check, chapter, next)
    if (check.error) return;

    const filteredChapters = sub.chapters.filter((ch) => ch.name.toString() !== chapter.toString());
    const publicId = sub.chapters.find((ch) => ch.name.toString() === chapter.toString())?.file.public_id;

    cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, function (error, result) {
        if (error) {
            console.error('Error deleting file:', error);
        } else {
            console.log('File deleted:', result);
        }
    });

    const prefixPath = `Semester/${semester}/questions/${subject}/`;

    try {
        // List all resources (assets) in the folder
        const { resources } = await cloudinary.api.resources({
            type: 'upload',
            prefix: prefixPath,
            max_results: 500,
        });

        // Filter resources strictly within the folder (ignoring subfolders)
        const filteredResources = resources.filter(resource => {
            return resource.public_id.startsWith(prefixPath) &&
                !resource.public_id.slice(prefixPath.length).includes('/');
        });

        const publicIds = filteredResources.map(resource => resource.public_id);

        if (publicIds.length > 0) {
            // Delete all the assets in the exact folder
            await cloudinary.api.delete_resources(publicIds);
        } else {
            console.log('No assets found in the folder:', prefixPath);
        }

        try {
            await cloudinary.api.delete_folder(prefixPath);
        } catch (error) {
            console.error('Error deleting folder:', prefixPath, error);
        }

    } catch (error) {
        console.error('Error deleting assets:', error);
    }


    await Sem.findOneAndUpdate({ semester, subject }, { chapters: filteredChapters }, {
        new: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })

})

//update a chapter --- (Admin)
exports.updateChapter = catchAsyncErrors(async (req, res, next) => {
    const semester = req.params.level;
    const subject = req.params.sub;
    const chapter = req.params.ch;

    // console.log('Update = ',req.body,'params = ',req.params)
    const check = {
        error: false
    }

    const { name, number, creditHrs, provider, topic, id } = req.body;


    const sub = await ValidateSubject(Sem, check, semester, subject, next)
    if (check.error) return;

    await ValidateChapter(sub, check, chapter, next)
    if (check.error) return;


    //check if chapter already exist
    const isChapExist = sub && sub.chapters.find((ch) => ch._id.toString() !== id.toString() && ch.name.toString() === name.toString());

    if (isChapExist)
        return next(new ErrorHandler("Chapter already exist", 400));

    //check if chapter number already exist
    const isChapNumExist = sub && sub.chapters.find((ch) => ch._id.toString() !== id.toString() && ch.number.toString() === number.toString());

    if (isChapNumExist) {
        return next(new ErrorHandler("Chapter number already exists", 400)); //bad request => 404
    }

    let fileInfo = {};
    let isFileInfo = false;
    const fileCheck = req.files['file'] ? req.files['file'][0] : null;
    if (fileCheck) {
        const publicId = sub.chapters.find((ch) => ch.name.toString() === chapter.toString())?.file.public_id;

        cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, function (error, result) {
            if (error) {
                console.error('Error deleting file:', error);
            } else {
                console.log('File deleted:', result);
            }
        });

        const file = req.files['file'][0];
        const fileUri = getDataUri(file)

        const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
            public_id: file.originalname.split('.')[0],
            folder: `Semester/${semester}/chapters/${subject}`,
        });

        fileInfo = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
        isFileInfo = true
    }

    sub.chapters.forEach((ch) => {
        if (ch.name.toString() === chapter.toString())
            (ch.name = name), (ch.number = number), (ch.file = isFileInfo ? fileInfo : ch.file),
                (ch.provider = provider), (ch.creditHrs = creditHrs), (ch.topic = topic)
    })


    await sub.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
    })

})

// Find() => returns a field with whom we are comparing on match otherwise null
//some() => returns a boolean value [T/F]

//Get all questions
exports.getAllQuestions = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 6;

    const { semester, subject, order, answer, page } = req.query;
    let data, filteredQuestions;

    if (semester === 'all' && subject === 'all') {
        const apiFeatures = new ApiFeatures(Sem.find(), req.query, "").filter()
        data = await apiFeatures.query;
    } else if (subject === 'all') {
        const apiFeatures = new ApiFeatures(Sem.find({ semester }), req.query, "").filter()
        data = await apiFeatures.query;
    } else {
        const apiFeatures = new ApiFeatures(Sem.find({ semester, subject }), req.query, "").filter()
        data = await apiFeatures.query;
    }


    const questions = data.flatMap(document => document.chapters.map(chapter => chapter.questions))

    // Flatten the array of arrays => that means merge the array of arrays into a single array
    const flattenedQuestions = questions.flat();

    // Sort the flattened array based on createdAt
    const sortedQuestions = flattenedQuestions.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        if (order === 'descending')
            return dateB - dateA;
        return dateA - dateB;
    });

    //filter the questions with answer 
    if (answer === "hasAnswer") {
        filteredQuestions = sortedQuestions.filter(sq => sq.answer.url)
    } else if (answer === "hasNoAnswer") {
        filteredQuestions = sortedQuestions.filter(sq => !sq.answer.url)
    } else {
        filteredQuestions = sortedQuestions
    }

    const filteredCount = filteredQuestions.length


    if (filteredCount > resultPerPage) {
        let count = 0;
        let requiredQuestions = []
        for (let i = ((page - 1) * resultPerPage); count < resultPerPage; i++) {
            if (i >= filteredCount)
                break;
            requiredQuestions.push(filteredQuestions[i])

            count++
        }
        filteredQuestions = requiredQuestions;
    }




    res.status(200).json({
        success: true,
        filteredQuestions,
        resultPerPage,
        filteredCount,
    })
})

//Add a question with answer --- (Admin)
exports.addQuestion = catchAsyncErrors(async (req, res, next) => {
    const { level: semester, sub: subject, ch: chapter } = req.params;
    const { qtn, askedOn } = req.body

    const provider = {
        name: req.user.username,
        url: req.user.avatar.url
    }
    const check = {
        error: false
    }

    const sub = await ValidateSubject(Sem, check, semester, subject, next);
    if (check.error) return;

    const chapt = await ValidateChapter(sub, check, chapter, next);
    if (check.error) return;

    const file = req.files['file'] ? req.files['file'][0] : null;

    let myCloud
    if (file) {
        const fileUri = getDataUri(file)

        myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
            public_id: file.originalname.split('.')[0],
            folder: `Semester/${semester}/questions/${subject}`,
        });
    }

    const uploadedFile = file ? {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
    } : {}

    const { questions } = chapt

    questions.push({ qtns: qtn, answer: uploadedFile, askedOn, provider, subject })

    await sub.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
        sub
    })
})


//Get answer of respective question
exports.getAnswer = catchAsyncErrors(async (req, res, next) => {
    const { level: semester, sub: subject, ch: chapter, id } = req.params;

    const check = {
        error: false
    }

    const sub = await ValidateSubject(Sem, check, semester, subject, next);
    if (check.error) return;

    const chapt = await ValidateChapter(sub, check, chapter, next);
    if (check.error) return;

    const { questions } = chapt

    const result = questions.find((q) => q._id.toString() === id.toString());

    if (!result)
        return next(new ErrorHandler("Invalid question!!"));

    res.status(200).json({
        success: true,
        result
    })
})

//Update the question 
exports.updateQuestion = catchAsyncErrors(async (req, res, next) => {
    const { level: semester, sub: subject, ch: chapter, id } = req.params;
    const { qtns, askedOn } = req.body

    const check = {
        error: false
    }

    const sub = await ValidateSubject(Sem, check, semester, subject, next);
    if (check.error) return;

    const chapt = await ValidateChapter(sub, check, chapter, next);
    if (check.error) return;

    const { questions } = chapt

    let result = questions.find((q) => q._id.toString() === id.toString());

    if (!result)
        return next(new ErrorHandler("Invalid question!!"));

    let fileInfo = {};
    let isFileInfo = false;

    const fileCheck = req.files['file'] ? req.files['file'][0] : null;
    if (fileCheck) {
        if (result.answer?.public_id) {
            const publicId = result.answer.public_id;

            cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, function (error, result) {
                if (error) {
                    console.error('Error deleting file:', error);
                } else {
                    console.log('File deleted:', result);
                }
            });
        }

        const file = req.files['file'][0];
        const fileUri = getDataUri(file)

        const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
            public_id: file.originalname.split('.')[0],
            folder: `Semester/${semester}/questions/${subject}`,
        });

        fileInfo = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
        isFileInfo = true
    }

    questions.forEach((q) => {
        if (q._id.toString() === id.toString()) {
            q.qtns = qtns,
                (q.answer = isFileInfo ? fileInfo : q.answer),
                q.askedOn = askedOn
        }
    })

    await sub.save({ validateBeforeSave: false })


    res.status(200).json({
        success: true,
        sub
    })
})


//Delete the question
exports.deleteQuestion = catchAsyncErrors(async (req, res, next) => {
    const { level: semester, sub: subject, ch: chapter, id } = req.params;

    const check = {
        error: false
    }

    const sub = await ValidateSubject(Sem, check, semester, subject, next);
    if (check.error) return;

    const chapt = await ValidateChapter(sub, check, chapter, next);
    if (check.error) return;

    const { questions } = chapt

    let result = questions.find((q) => q._id.toString() === id.toString());

    if (!result)
        return next(new ErrorHandler("Invalid question!!"));

    if (result.answer) {
        const publicId = result.answer.public_id;

        cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, function (error, result) {
            if (error) {
                console.error('Error deleting file:', error);
            } else {
                console.log('File deleted:', result);
            }
        });
    }

    const FilteredQuestions = questions.filter((q) => q._id.toString() !== id.toString())

    chapt.questions = FilteredQuestions

    await sub.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
        message: "Question Deleted successsfully"
    })
})

//Add the question bank
exports.addQtnsBank = catchAsyncErrors(async (req, res, next) => {
    const { year } = req.body;
    const { level: semester, sub: subject } = req.params;
    const check = {
        error: false
    }

    const sub = await ValidateSubject(Sem, check, semester, subject, next);

    if (check.error) return

    const isYearExist = sub.qtnsBank.some((q) => q.year.toString() === year.toString())

    if (isYearExist)
        return next(new ErrorHandler("Question bank with this year already exist", 400));


    const file = req.files['file'][0];
    const fileUri = getDataUri(file)

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
        public_id: file.originalname.split('.')[0],
        folder: `Semester/${semester}/questionBank/${subject}`,
    });


    const uploadedFile = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
    }

    const { qtnsBank } = sub

    qtnsBank.push({ year, file: uploadedFile });

    await sub.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        sub
    })

})

//Update the question bank
exports.updateQtnBank = catchAsyncErrors(async (req, res, next) => {
    const { year, id } = req.body;
    console.log(req.body)
    const { level: semester, sub: subject, yrs } = req.params;
    console.log(typeof yrs)
    const check = {
        error: false
    }

    const sub = await ValidateSubject(Sem, check, semester, subject, next);

    if (check.error) return

    const result = sub.qtnsBank.find((q) => q.year.toString() === yrs.toString())

    if (!result)
        return next(new ErrorHandler("Question bank with this year doesnot found", 404));

    const isYearExist = sub.qtnsBank.some((q) => q._id.toString() !== id.toString() && q.year.toString() === year.toString())

    if (isYearExist)
        return next(new ErrorHandler("Question bank with this year already exist", 409));

    let fileInfo = {};
    let isFileInfo = false;
    const fileCheck = req.files['file'] ? req.files['file'][0] : null;
    if (fileCheck) {
        const publicId = result.file.public_id;
        cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, function (error, result) {
            if (error) {
                console.error('Error deleting file:', error);
            } else {
                console.log('File deleted:', result);
            }
        });

        const file = req.files['file'][0];
        const fileUri = getDataUri(file)

        const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
            public_id: file.originalname.split('.')[0],
            folder: `Semester/${semester}/questionBank/${subject}`,
        });

        fileInfo = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
        isFileInfo = true
    }

    sub.qtnsBank.forEach((q) => {
        if (q.year.toString() === yrs.toString()) {
            q.year = year;
            (q.file = isFileInfo ? fileInfo : q.file);
        }
    })

    await sub.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        sub
    })

})

//Delete the question bank
exports.deleteQtnBank = catchAsyncErrors(async (req, res, next) => {
    const { level: semester, sub: subject, yrs } = req.params;
    const check = {
        error: false
    }

    const sub = await ValidateSubject(Sem, check, semester, subject, next);

    if (check.error) return

    const qtnBank = sub.qtnsBank.find((q) => q.year.toString() === yrs.toString())
    console.log(qtnBank)

    if (!qtnBank)
        return next(new ErrorHandler("Question bank with this year doesnot found", 404));

    const publicId = qtnBank.file.public_id;

    cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, function (error, result) {
        if (error) {
            console.error('Error deleting file:', error);
        } else {
            console.log('File deleted:', result);
        }
    });

    const filteredQtnsBank = sub.qtnsBank.filter((q) => q.year.toString() !== yrs.toString())

    sub.qtnsBank = filteredQtnsBank

    await sub.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Question bank deleted successfully"
    })

})

//Add the book
exports.addBook = catchAsyncErrors(async (req, res, next) => {
    const { writer, subject } = req.body;
    const { level: semester } = req.params;

    const sub = await Sem.findOne({ semester, subject });

    //409 Conflict: This status code is specifically used when the request conflicts with the current state of the resource.
    if (sub?.book?.file?.public_id) {
        return next(new ErrorHandler(`The book has been already uploaded for the subjet ${subject} `, 409));
    }

    const file = req.files['file'][0];
    const fileUri = getDataUri(file)

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
        public_id: file.originalname.split('.')[0],
        folder: `Semester/${semester}/books/${subject}`,
    });


    const uploadedFile = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
    }

    await Sem.findOneAndUpdate({ semester, subject }, { book: { writer, file: uploadedFile } }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "Book added successfully"
    })

})

//Update the book 
exports.updateBook = catchAsyncErrors(async (req, res, next) => {

    const { level: semester, sub: subject } = req.params;
    const check = {
        error: false
    }
    const updateSub = await ValidateSubject(Sem, check, semester, req.body.subject, next);
    if (check.error) return

    if (updateSub?.book?.file?.public_id && subject !== req.body.subject) {
        return next(new ErrorHandler(`The book has been already uploaded for the subjet ${req.body.subject} `, 409));
    }

    let myCloud = {}
    let isFileInfo = false
    const sub = await Sem.findOne({ semester, subject })

    const fileCheck = req.files['file'] ? req.files['file'][0] : null;
    if (fileCheck && sub?.book?.file?.public_id) {
        const publicId = sub.book.file.public_id;
        cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, function (error, result) {
            if (error) {
                console.error('Error deleting file:', error);
            } else {
                console.log('File deleted:', result);
            }
        });

        const file = req.files['file'][0];
        const fileUri = getDataUri(file)

        myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
            public_id: file.originalname.split('.')[0],
            folder: `Semester/${semester}/books/${req.body.subject}`,
        });

        isFileInfo = true
    }

    const newBook = isFileInfo ? ({
        writer: req.body.writer,
        file: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }) : ({
        writer: req.body.writer,
        file: sub.book.file
    })
    updateSub.book = newBook
    await updateSub.save()

    if (subject !== req.body.subject) {
        await Sem.findOneAndUpdate({ semester, subject }, { book: {} }, {
            new: true
        }
        )
    }

    res.status(200).json({
        success: true,
        message: "Book updated successfully"
    })
})

//Delete the book
exports.deleteBook = catchAsyncErrors(async (req, res, next) => {
    const { level: semester, sub: subject } = req.params;
    const check = {
        error: false
    }

    const sub = await ValidateSubject(Sem, check, semester, subject, next);
    if (check.error) return

    const publicId = sub.book.file.public_id;

    cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, function (error, result) {
        if (error) {
            console.error('Error deleting file:', error);
        } else {
            console.log('File deleted:', result);
        }
    });

    await Sem.updateOne({ semester, subject }, { book: {} }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "Book deleted successfully"
    })

})

//Add the Lab
exports.addLab = catchAsyncErrors(async (req, res, next) => {
    const { provider, subject } = req.body;
    const { level: semester } = req.params;

    const sub = await Sem.findOne({ semester, subject });

    if (sub?.labReport?.file?.public_id) {
        return next(new ErrorHandler(`The lab report has been already uploaded for the subjet ${subject} `, 409));
    }

    const file = req.files['file'][0];
    const fileUri = getDataUri(file)

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
        public_id: file.originalname.split('.')[0],
        folder: `Semester/${semester}/labReports/${subject}`,
    });


    const uploadedFile = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
    }

    await Sem.findOneAndUpdate({ semester, subject }, { labReport: { provider, file: uploadedFile } }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "Lab added successfully"
    })


})

//Update the Lab
exports.updateLab = catchAsyncErrors(async (req, res, next) => {
    const { level: semester, sub: subject } = req.params;
    const check = {
        error: false
    }

    const updateSub = await ValidateSubject(Sem, check, semester, req.body.subject, next);
    if (check.error) return

    if (updateSub?.labReport?.file?.public_id && subject !== req.body.subject) {
        return next(new ErrorHandler(`The book has been already uploaded for the subjet ${req.body.subject} `, 409));
    }

    let myCloud = {}
    let isFileInfo = false
    const sub = await Sem.findOne({ semester, subject })

    const fileCheck = req.files['file'] ? req.files['file'][0] : null;

    if (fileCheck) {
        const publicId = sub.labReport.file.public_id;
        cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, function (error, result) {
            if (error) {
                console.error('Error deleting file:', error);
            } else {
                console.log('File deleted:', result);
            }
        });

        const file = req.files['file'][0];
        const fileUri = getDataUri(file)

        myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
            public_id: file.originalname.split('.')[0],
            folder: `Semester/${semester}/labReports/${req.body.subject}`,
        });

        isFileInfo = true
    }

    const newLab = isFileInfo ? ({
        provider: req.body.provider,
        file: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }) : ({
        provider: req.body.provider,
        file: sub.labReport.file
    })

    updateSub.labReport = newLab
    await updateSub.save()

    if (subject !== req.body.subject) {
        await Sem.findOneAndUpdate({ semester, subject }, { labReport: {} }, {
            new: true
        }
        )
    }

    res.status(200).json({
        success: true,
        message: "Lab updated successfully"
    })
})

//Delete the Lab
exports.deleteLab = catchAsyncErrors(async (req, res, next) => {
    const { level: semester, sub: subject } = req.params;
    const check = {
        error: false
    }

    const sub = await ValidateSubject(Sem, check, semester, subject, next);
    if (check.error) return

    const publicId = sub.labReport.file.public_id;

    cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, function (error, result) {
        if (error) {
            console.error('Error deleting file:', error);
        } else {
            console.log('File deleted:', result);
        }
    });

    await Sem.updateOne({ semester, subject }, { labReport: {} }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "Lab deleted successfully"
    })

})

//Add the Viva
exports.addViva = catchAsyncErrors(async (req, res, next) => {
    const { provider, subject } = req.body;
    const { level: semester } = req.params;

    const sub = await Sem.findOne({ semester, subject });

    if (sub?.viva?.file?.public_id) {
        return next(new ErrorHandler(`The viva has been already uploaded for the subjet ${subject} `, 409));
    }

    const file = req.files['file'][0];
    const fileUri = getDataUri(file)

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
        public_id: file.originalname.split('.')[0],
        folder: `Semester/${semester}/viva/${subject}`,
    });


    const uploadedFile = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
    }

    await Sem.findOneAndUpdate({ semester, subject }, { viva: { provider, file: uploadedFile } }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "Viva added successfully"
    })


})

//Update the Viva
exports.updateViva = catchAsyncErrors(async (req, res, next) => {
    const { level: semester, sub: subject } = req.params;
    const check = {
        error: false
    }

    const updateSub = await ValidateSubject(Sem, check, semester, req.body.subject, next);
    if (check.error) return

    if (updateSub?.viva?.file?.public_id && subject !== req.body.subject) {
        return next(new ErrorHandler(`The book has been already uploaded for the subjet ${req.body.subject} `, 409));
    }

    let myCloud = {}
    let isFileInfo = false
    const sub = await Sem.findOne({ semester, subject })

    const fileCheck = req.files['file'] ? req.files['file'][0] : null;

    if (fileCheck) {
        const publicId = sub.viva.file.public_id;
        cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, function (error, result) {
            if (error) {
                console.error('Error deleting file:', error);
            } else {
                console.log('File deleted:', result);
            }
        });

        const file = req.files['file'][0];
        const fileUri = getDataUri(file)

        myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
            public_id: file.originalname.split('.')[0],
            folder: `Semester/${semester}/viva/${req.body.subject}`,
        });

        isFileInfo = true
    }

    const newViva = isFileInfo ? ({
        provider: req.body.provider,
        file: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }) : ({
        provider: req.body.provider,
        file: sub.viva.file
    })

    updateSub.viva = newViva
    await updateSub.save()

    if (subject !== req.body.subject) {
        await Sem.findOneAndUpdate({ semester, subject }, { viva: {} }, {
            new: true
        }
        )
    }

    res.status(200).json({
        success: true,
        message: "Viva updated successfully"
    })
})

//Delete the Viva
exports.deleteViva = catchAsyncErrors(async (req, res, next) => {
    const { level: semester, sub: subject } = req.params;
    const check = {
        error: false
    }

    const sub = await ValidateSubject(Sem, check, semester, subject, next);

    if (check.error) return

    const publicId = sub.viva.file.public_id;

    cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, function (error, result) {
        if (error) {
            console.error('Error deleting file:', error);
        } else {
            console.log('File deleted:', result);
        }
    });

    await Sem.updateOne({ semester, subject }, { viva: {} }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "Viva deleted successfully"
    })

})

//Addding comment into a chapter
exports.addComment = catchAsyncErrors(async (req, res, next) => {
    const { text, subjectId, chapterId } = req.body;

    const comment = {
        user: req.user.id,
        name: req.user.username,
        profileImg: req.user.avatar.url,
        text,
    }

    const sub = await Sem.findOne({ _id: subjectId });

    if (!sub)
        return next(new ErrorHandler("Subject is not found", 404));

    const chapter = sub.chapters.find((c) => c._id.toString() === chapterId.toString());

    if (!chapter)
        return next(new ErrorHandler("Chapter is not found", 404));
    
    try {
        comment.sentiment = await getSentimentPrediction(text);
    } catch (error) {
        console.error('Error in sentiment prediction:', error);
        return next(new ErrorHandler("Failed to analyze comment sentiment", 500));
    }

    chapter.comments.push(comment)

    await sub.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Comment added successfully"
    })
})

//Adding reply to the comment
exports.replyComment = catchAsyncErrors(async (req, res, next) => {
    const { text, subjectId, chapterId } = req.body;
    const { id: cmtId } = req.params

    const comment = {
        user: req.user.id,
        name: req.user.username,
        profileImg: req.user.avatar.url,
        text,
    }

    const sub = await Sem.findOne({ _id: subjectId });

    if (!sub)
        return next(new ErrorHandler("Subject is not found", 404));

    const chapter = sub.chapters.find((c) => c._id.toString() === chapterId.toString());

    if (!chapter)
        return next(new ErrorHandler("Chapter is not found", 404));


    const isComment = chapter.comments.find((c) => c._id.toString() === cmtId.toString());

    try {
        // Wait for sentiment prediction
        comment.sentiment = await getSentimentPrediction(text);
    } catch (error) {
        console.error('Error in sentiment prediction:', error);
        return next(new ErrorHandler("Failed to analyze comment sentiment", 500));
    }

    isComment.replies.push(comment)

    await sub.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Replied successfully"
    })
})

//Adding like and unlike to comment
exports.addCommentLikeUnlike = catchAsyncErrors(async (req, res, next) => {
    const { like, unlike, subjectId, chapterId } = req.body;

    const { id: cmtId } = req.params

    const sub = await Sem.findOne({ _id: subjectId });

    if (!sub)
        return next(new ErrorHandler("Subject is not found", 404));

    const chapter = sub.chapters.find((c) => c._id.toString() === chapterId.toString());

    if (!chapter)
        return next(new ErrorHandler("Chapter is not found", 404));


    const isComment = chapter.comments.some((c) => c._id.toString() === cmtId.toString());


    if (isComment) {
        chapter.comments.forEach((c) => {
            if (c._id.toString() === cmtId.toString()) {
                setLikeUnlike(c, req.user.id, like, unlike)
            }
        })
    }

    await sub.save({ validateBeforeSave: false });


    res.status(200).json({
        success: true,
        message: "like unlike added successfully"
    })
})

//Adding like and unlike to reply
exports.addReplyLikeUnlike = catchAsyncErrors(async (req, res, next) => {
    const { like, unlike, subjectId, chapterId } = req.body;

    const { cid: cmtId, rid: replyId } = req.params

    const sub = await Sem.findOne({ _id: subjectId });

    if (!sub)
        return next(new ErrorHandler("Subject is not found", 404));

    const chapter = sub.chapters.find((c) => c._id.toString() === chapterId.toString());

    if (!chapter)
        return next(new ErrorHandler("Chapter is not found", 404));


    const comment = chapter.comments.find((c) => c._id.toString() === cmtId.toString());

    const isReply = comment.replies.some((c) => c._id.toString() === replyId.toString());


    if (isReply) {
        comment.replies.forEach((c) => {
            if (c._id.toString() === replyId.toString()) {
                setLikeUnlike(c, req.user.id, like, unlike)
            }
        })
    }

    await sub.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "like unlike added successfully"
    })
})