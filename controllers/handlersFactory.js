import expressAsyncHandler from 'express-async-handler';
import { APIerrors } from '../utils/Errors.js';
import ApiFeatures from '../utils/Features.js';

export const getAllMethod = (model, name) =>
    expressAsyncHandler(async (req, res) => {
        let filterData = {};
        if (req.filterData) { filterData = req.filterData }
        // Build Query
        const documents = await model.countDocuments();
        const features = new ApiFeatures(model.find(filterData), req.query)
            .paginate(documents).sort().fields().search(name).filter()
        // Execute Query
        const { mongooseQuery, paginationResult } = features;
        const allDocuments = await mongooseQuery;
        res.json({ size: allDocuments.length, paginationResult, allDocuments });
    });

export const getOneMethod = (model) =>
    expressAsyncHandler(async (req, res, next) => {
        const { _id } = req.params;
        const document = await model.findById(_id);
        if (!document) { return next(new APIerrors('Item Not Found', 404)) }
        else { res.json({ document }) }
    });

export const createMethod = (model) =>
    expressAsyncHandler(async (req, res) => {
        const document = await model.create(req.body);
        res.json({ message: 'Item added successfully', document });
    });

export const updateMethod = (model) =>
    expressAsyncHandler(async (req, res, next) => {
        const { _id } = req.params
        const updatedDocument = await model.findByIdAndUpdate(_id, { $set: req.body }, { new: true })
        if (!updatedDocument) { return next(new APIerrors('Item Not Found', 404)) }
        else { res.json({ message: "Item Updated Successfully", updatedDocument }) }
    });

export const deleteMethod = (model) =>
    expressAsyncHandler(async (req, res, next) => {
        const { _id } = req.params
        const document = await model.findByIdAndDelete(_id)
        if (!document) { return next(new APIerrors('Item Not Found', 404)) }
        else { res.json({ message: 'Item Deleted Successfully' }) }
    })