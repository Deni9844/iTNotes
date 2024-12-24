const ErrorHandler = require('../utils/ErrorHandler')

exports.ValidateSubject = async (Sem,obj,semester,subject,next) => {
    const sub = await Sem.findOne({ semester, subject });
    if (!sub){
        obj.error = true;
        return next(new ErrorHandler("Subject not found"), 404);
    }
    return sub;
        
}

exports.ValidateChapter = async (sub,obj,chapter,next) => {

    const chapt = sub.chapters.find((ch) => ch.name.toString() === chapter.toString())
  
    if (!chapt){
        obj.error = true;
        return next(new ErrorHandler("Chapter not found"), 404);
    }
    
       
    return chapt;        
}

exports.setLikeUnlike = (c,userId,like,unlike) => {  
            const hasLiked = c.like.users.some((c) => c.user.toString() === userId.toString());
            if(!hasLiked)
               c.like.value += like.value;
            const hasUnLiked = c.unlike.users.some((c) => c.user.toString() === userId.toString());
            if(!hasUnLiked)
              c.unlike.value += unlike.value;


            if (like.value && !unlike.value) {
                if (c.unlike.users.length > 0) {
                    const FilteredUnlikeUsers = c.unlike.users.filter((c) => c.user.toString() != userId.toString());                       
                    if(c.unlike.users.length - FilteredUnlikeUsers.length > 0 ){
                        c.unlike.value -=1
                        c.unlike.users = FilteredUnlikeUsers
                    }
                }
                const isExist = c.like.users.some((c) => c.user.toString() === userId.toString());
                if (!isExist) {
                    c.like.users.push({ user: userId })
                }
            } else if (unlike.value && !like.value) {
                if (c.like.users.length > 0) {
                    const FilteredLikeUsers = c.like.users.filter((c) => c.user.toString() != userId.toString());
                   
                    if(c.like.users.length - FilteredLikeUsers.length > 0 ){
                        c.like.value -=1
                        c.like.users = FilteredLikeUsers
                    }
                       
                }
                const isExist = c.unlike.users.some((c) => c.user.toString() === userId.toString());
                if (!isExist) {
                    c.unlike.users.push({ user: userId })
                }
            } else  {
                const FilteredUnlikeUsers = c.unlike.users.filter((c) => c.user.toString() != userId.toString());
                if(c.unlike.users.length - FilteredUnlikeUsers.length > 0 ){
                    c.unlike.value -= 1
                    c.unlike.users = FilteredUnlikeUsers

                }
                const FilteredLikeUsers = c.like.users.filter((c) => c.user.toString() != userId.toString());
                if(c.like.users.length - FilteredLikeUsers.length > 0 ){
                    c.like.value -=1
                    c.like.users = FilteredLikeUsers
                }
            }
}