import catchAsync from "../managers/catchAsync.js";
import APIFeatures from "./APIFeatures.js"
import AppError from "../managers/AppError.js";

export const getAllDocs = Model => catchAsync(async (req, res, next)=>{
    const features = new APIFeatures(Model.find(),req.query)

    features.filter().sort().fields().paginator();

    const docs = await features.query

    res.status(200).json({
        status: 'success',
        results: docs.length,
        requestedAt: req.requestedAt,
        data: docs,
    });
})

export const getDoc = Model => catchAsync(async (req, res, next)=>{
    const doc=await Model.findById(req.params.id);
    if(!doc) return next(new AppError("No document of this ID found", 401))
    res.status(200).json({
        status:"success",
        requestedAt: req.requestedAt,
        data:doc
    })
})

export const updateDoc = (Model, filteredBody)=> catchAsync(async (req, res, next)=>{
    const doc= await Model.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true
    })

    if(!doc) return next(new AppError("No document of this ID found", 401))

    res.status(200).json({
        status:"success",
        requestedAt: req.requestedAt,
        data:doc
    })
})

export const deleteDoc = Model => catchAsync(async (req, res, next)=>{
    await Model.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status:"success",
        requestedAt: req.requestedAt,
        data:null
    })
})
