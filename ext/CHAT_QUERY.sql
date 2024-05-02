-- 쿼리
select * from ex1.CHAT_CONTENTS;
select * from ex1.CHAT_MASTER;
select * from ex1.CHAT_MEMBER;
select * from ex1.CHAT_READ_HISTORY;

-- / POST
SELECT D.CHAT_ROOM_NAME, D.MASTER_SEQ, CONCAT(LEFT(D.MEMBER_NM, 25), IF(CHAR_LENGTH(D.MEMBER_NM) > 25, '...', '')) AS MEMBER_NM, D.MEMBER_NM AS FULL_MEMBER_NM, CONCAT(LEFT(E.CONTENTS, 25), IF(CHAR_LENGTH(E.CONTENTS) > 25, '...', '')) AS CONTENTS, D.USER_CNT,
	CASE WHEN CURRENT_DATE() = DATE_FORMAT(E.REG_DATE, '%Y-%m-%d') THEN DATE_FORMAT(E.REG_DATE, '%h:%i')
		WHEN DATE_FORMAT(CURRENT_DATE()-1, '%Y-%m-%d') = DATE_FORMAT(E.REG_DATE, '%Y-%m-%d') THEN 'Yesterday'
		ELSE DATE_FORMAT(E.REG_DATE, '%Y-%m-%d') END AS REG_DATE,
        NVL(F.UNREAD_CNT, 0) AS UNREAD_CNT
FROM
	(SELECT A.CHAT_ROOM_NAME, A.MASTER_SEQ, GROUP_CONCAT(C.USERNAME ORDER BY B.MEMBER_SEQ separator ', ') AS MEMBER_NM, COUNT(C.USERNAME) USER_CNT
	FROM ex1.CHAT_MASTER A
		LEFT OUTER JOIN ex1.CHAT_MEMBER B ON A.MASTER_SEQ = B.MASTER_SEQ AND MEMBER_SEQ != (SELECT MEMBER_SEQ FROM color_memo.MEMBER WHERE EMAIL = 'ljh1032112@gmail.com')
		LEFT OUTER JOIN color_memo.MEMBER C ON B.MEMBER_SEQ = C.MEMBER_SEQ
	WHERE A.MASTER_SEQ IN (SELECT MASTER_SEQ FROM ex1.CHAT_MEMBER WHERE MEMBER_SEQ = (SELECT MEMBER_SEQ FROM color_memo.MEMBER WHERE EMAIL = 'ljh1032112@gmail.com'))
	GROUP BY A.CHAT_ROOM_NAME, A.MASTER_SEQ ) D
	LEFT OUTER JOIN ex1.V_CHAT_LAST_CONTENTS_LIST E ON D.MASTER_SEQ = E.MASTER_SEQ
	LEFT OUTER JOIN (SELECT MASTER_SEQ, COUNT(CONTENTS_SEQ) UNREAD_CNT 
		FROM ex1.V_CHAT_NOT_READ_CONTENTS 
		WHERE MEMBER_SEQ = (SELECT MEMBER_SEQ FROM color_memo.MEMBER WHERE EMAIL = 'ljh1032112@gmail.com')
        GROUP BY MASTER_SEQ) F
	ON D.MASTER_SEQ = F.MASTER_SEQ 
    ORDER BY E.REG_DATE DESC;

-- /chat_contents POST
-- CHAT_READ_HISTORY 업데이트
UPDATE ex1.CHAT_READ_HISTORY H
SET H.READ_DATE = CURRENT_TIMESTAMP
WHERE H.CONTENTS_SEQ IN (
	SELECT A.CONTENTS_SEQ
	FROM ex1.CHAT_CONTENTS A, ex1.CHAT_READ_HISTORY B
	WHERE A.CONTENTS_SEQ = B.CONTENTS_SEQ AND A.MASTER_SEQ = 1 
		AND B.MEMBER_SEQ = (SELECT MEMBER_SEQ FROM color_memo.MEMBER WHERE EMAIL = 'ljh1032112@gmail.com')
		AND B.READ_DATE IS NULL
	)
    AND H.MEMBER_SEQ = (SELECT MEMBER_SEQ FROM color_memo.MEMBER WHERE EMAIL = 'ljh1032112@gmail.com');
-- CHAT_CONTENTS 조회
SELECT A.CONTENTS, A.REG_ID, A.REG_DATE, DATE_FORMAT(A.REG_DATE, '%Y-%m-%d') AS REG_DAY, DATE_FORMAT(A.REG_DATE, '%h:%i') AS REG_TIME,
    CASE WHEN A.CHAT_DIV = 'SYSTEM' THEN 'sys' 
		WHEN A.REG_ID = 'chattest' THEN 'mine' 
        ELSE 'other' END AS MINE_DIV,
    COUNT(B.MEMBER_SEQ) - COUNT(B.READ_DATE) AS UNREAD_NUM, CHAT_DIV,
    M.USERNAME
FROM ex1.CHAT_CONTENTS A
JOIN ex1.CHAT_READ_HISTORY B ON A.CONTENTS_SEQ = B.CONTENTS_SEQ AND A.MASTER_SEQ = 1
LEFT JOIN color_memo.MEMBER M ON A.REG_ID = M.EMAIL
GROUP BY A.CONTENTS, A.REG_ID, A.REG_DATE, M.USERNAME
ORDER BY A.REG_DATE;

-- /insert POST
-- CONTENTS_SEQ 조회
SELECT NVL(MAX(CONTENTS_SEQ), 0) + 1 AS SEQ FROM ex1.CHAT_CONTENTS;
-- CHAT_CONTENTS 데이터 삽입
INSERT INTO ex1.CHAT_CONTENTS(MASTER_SEQ, CONTENTS_SEQ, CONTENTS, REG_ID, REG_DATE) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP);
-- CHAT_READ_HISTORY 데이터 삽입
INSERT INTO ex1.CHAT_READ_HISTORY(CONTENTS_SEQ, MEMBER_SEQ) SELECT ?, MEMBER_SEQ FROM ex1.CHAT_MEMBER WHERE MASTER_SEQ = ?;


-- VIEW ex1.V_CHAT_NOT_READ_CONTENTS
SELECT A.MASTER_SEQ, B.CONTENTS_SEQ, C.MEMBER_SEQ, C.READ_DATE 
FROM ex1.CHAT_MASTER A, ex1.CHAT_CONTENTS B, ex1.CHAT_READ_HISTORY C
WHERE A.MASTER_SEQ = B.MASTER_SEQ AND B.CONTENTS_SEQ = C.CONTENTS_SEQ
	AND C.READ_DATE IS NULL;
    
-- /get_chat_users POST
SELECT MEMBER_SEQ, EMAIL, USERNAME
FROM color_memo.MEMBER
WHERE EMAIL != "ljh1032112@gmail.com"
ORDER BY MEMBER_SEQ;
    
-- /create POST
-- MASTER_SEQ 조회
SELECT NVL(MAX(MASTER_SEQ), 0) + 1 AS SEQ FROM ex1.CHAT_MASTER;
-- CHAT_MASTER 데이터 삽입
INSERT INTO ex1.CHAT_MASTER(MASTER_SEQ, CHAT_ROOM_NAME, REG_ID, REG_DATE) VALUES (?, ?, ?, CURRENT_TIMESTAMP);
-- CHAT_MEMBER 데이터 삽입
INSERT INTO ex1.CHAT_MEMBER(MASTER_SEQ, MEMBER_SEQ, CHAT_USER, MASTER_DIV, REG_ID, REG_DATE)
SELECT ?, MEMBER_SEQ, EMAIL, '0', ?, CURRENT_TIMESTAMP FROM color_memo.MEMBER WHERE MEMBER_SEQ = ?;
-- CHAT_MEMBER 본인 데이터 삽입
INSERT INTO ex1.CHAT_MEMBER(MASTER_SEQ, MEMBER_SEQ, CHAT_USER, MASTER_DIV, REG_ID, REG_DATE)
SELECT ?, MEMBER_SEQ, EMAIL, '1', ?, CURRENT_TIMESTAMP FROM color_memo.MEMBER WHERE EMAIL = ?;
-- SYSTEM 대화방 초대 contents
INSERT INTO ex1.CHAT_CONTENTS(MASTER_SEQ, CONTENTS_SEQ, CONTENTS, CHAT_DIV, REG_ID, REG_DATE)
VALUES (?, ?, CONCAT(?, '님이 ', ?, '님을 초대하였습니다.'), 'SYSTEM', ?, CURRENT_TIMESTAMP); 

