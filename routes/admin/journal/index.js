import express from "express";
import _ from "lodash";
import Config from "../../../util/config";
import sequelize from '../../../models';
const Op = sequelize.Op;
var router = express.Router();

// 전체 조회.
router.get('', async (req, res, next) => {
    try {
        // page nation, sort, order.
        var sort = req.query._sort === undefined || 'id' ? 'id' : req.query._sort;
        var order = req.query._order === undefined || null ? 'DESC' : req.query._order;
        var  _end = req.query._end === undefined || null ? 0 : Number(req.query._end);
        var _start = req.query._start === undefined || null ? 0 : Number(req.query._start);

        var journal_all = await sequelize.Journal.findAndCountAll({
            order: [[sort, order]],
            offset: _start,
            limit: _end,
        });

        // 관리자 페이지에서 필요한 헤더 값 세팅.
        res.setHeader("Access-Control-Expose-Headers", "Content-Range");
        res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
        res.setHeader("Content-Range", `0-5/${journal_all.count}`);
        res.setHeader("X-Total-Count", `${journal_all.count}`);
        res.send(journal_all.rows);
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// 단일 조회.
router.get('/:id', async (req, res, next) => {
    try {
        var journal_one = await sequelize.Journal.findOne({
            where: {
                id: req.params.id
            }
        });

        // 관리자 페이지에서 필요한 헤더 값 세팅.
        res.setHeader("Access-Control-Expose-Headers", "Content-Range");
        res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
        res.setHeader("Content-Range", `0-5/${1}`);
        res.setHeader("X-Total-Count", `${1}`);
        res.send(journal_one);
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
})

// 생성
router.post('', async (req, res, next) => {
    try {
        req.body.area_fid_prefix = Config.createEncoding(req.body.area_id);
        var create_journal = await sequelize.Journal.create(req.body);   

        res.send(create_journal);
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

// 삭제
router.delete('/:id', async (req, res, next) => {
    try {
        var delete_journal = await sequelize.Journal.destroy({
            where: {
                id: req.params.id
            }
        });

        res.send(delete_journal);
    } catch (error) {
        console.log(error);
        res.send({"result": "fail" , "message": error.message});
    }
});

module.exports = router;