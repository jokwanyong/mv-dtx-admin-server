import express from "express";
import _ from "lodash";
import sequelize from "../../../models";
const Op = sequelize.Op;
var router = express.Router();

// 전체조회
router.get("", async (req, res) => {
  try {

    // sort 없을 시 all map
    if(req.query._sort === undefined) {
      var material = await sequelize.Material.findAndCountAll({
        
      });
    }
    else {
      var material = await sequelize.Material.findAndCountAll({
        order: [[req.query._sort, req.query._order]],
        offset: Number(req.query._start),
        limit: Number(req.query._end),
      });
    }
    
    // 관리자 페이지에서 필요한 헤더 값 세팅.
    res.setHeader("Access-Control-Expose-Headers", "Content-Range");
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    res.setHeader("Content-Range", `0-5/${material.count}`);
    res.setHeader("X-Total-Count", `${material.count}`);
    
    // 관리자 페이지에 필요하도록 id 세팅
    _.map(material.rows, data => {
      data.dataValues.id = String(data.dataValues.id);
    });
    res.send(material.rows);
  } catch (error) {
    console.log(error);
    res.send({"result": "fail" , "message": error.message});
  }
});

// 단일 조회.
router.get("/:id", async (req, res) => {
  try {
    var material_one = await sequelize.Material.findOne({
      where: {
        id: req.params.id
      }
    });

    // 관리자 페이지 용 id 세팅.
    material_one.dataValues.id = String(material_one.dataValues.id);
    res.setHeader("Access-Control-Expose-Headers", "Content-Range");
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    res.setHeader("Content-Range", `0-5/${1}`);
    res.setHeader("X-Total-Count", `${1}`);
    res.send(material_one);
  } catch (error) {
    console.log(error);
    res.send({"result": "fail" , "message": error.message});
  }
});

// 생성
router.post("", async (req, res, next) => {
  try {

    var material_create = await sequelize.Material.create({
      abbreviation: req.body.abbreviation,
      full_name: req.body.full_name
    });

    // 결과 return
    res.send(material_create);
  } catch (error) {
    console.log(error);
    res.send({"result": "fail" , "message": error.message});
  }
});

// 수정
router.put("/:id", async (req, res, next) => {
  try {
    var material_update = await sequelize.Material.update(
      {
        abbreviation: req.body.abbreviation,
        full_name: req.body.full_name
      },
      {
        where: {
          id: req.params.id
        }
      }
    );

    res.send({ id: req.params.id });
  } catch (error) {
    console.log(error);
  }
});

// 삭제
router.delete("/:id", async (req, res, next) => {
  try {
    var material_delete = await sequelize.Material.destroy({
      where: {
        id: req.params.id
      }
    });
    res.send(material_delete);
  } catch (error) {
    console.log(error);
    res.send({"result": "fail" , "message": error.message});
  }
});

module.exports = router;
