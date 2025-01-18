import CategoryModel from "../models/CategoryModel.js"


const addCategory = async (req,res) => {
    try {

        const { name } = req.body

        const newCategory = new CategoryModel({
            name:name,
            status:1
        })

        const category = await newCategory.save();

        res.json({success:true, message: "Added new Category"})

    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

const getCategory = async (req,res) => {
    try {

        const categories = await CategoryModel.find({});
        res.json({success:true,categories})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export { addCategory, getCategory }