import Axios from 'axios';

// 파일 삭제 여부 알려주는 함수
// type 으로는 연결부, 파이프 
// joint , pipe 

const fileIo = async (real_id, type) => {
    try {
        var parameter = {
            "real_id": real_id,
            "type": type  
        }
        await Axios.post('http://127.0.0.1:8080' + "/mv-pipe-analysis/lod/tileset", parameter);
        return;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export {
    fileIo
}