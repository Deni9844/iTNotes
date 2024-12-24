class ApiFeatures {
    constructor(query, queryStr, forType) {
        this.query = query;
        this.queryStr = queryStr;
        this.forType = forType;
    }

    filter() {
        const keyword = this.queryStr.keyword ?
            (this.forType === "note" ? {
                subject: {
                    $regex: this.queryStr.keyword,// when you are using $regex directly on a non-array field, the $options: "i" can be used without the need for new RegExp().
                    $options: "i" //case insensitive  
                }
            } : {
                "chapters.questions.qtns": {
                    $regex: new RegExp(this.queryStr.keyword, "i")//for the nested array case,  use new RegExp() to construct a regex pattern:
                }
            }) : {}

        this.query = this.query.find({ ...keyword })
        return this; //return the object
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = (currentPage - 1) * resultPerPage;

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;

    }
}

module.exports = ApiFeatures