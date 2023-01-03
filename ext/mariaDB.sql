CREATE TABLE color_memo.MEMBER (
	EMAIL VARCHAR(500) NOT NULL,
	PASSWORD VARCHAR(100) NOT NULL,
	USERNAME VARCHAR(100) NOT NULL,
    DEFAULT_CNO INT,     
	PRIMARY KEY (EMAIL)
); 

CREATE TABLE color_memo.MEMO (
    MNO            INT NOT NULL,     
    MNAME          VARCHAR(100) NOT NULL,    
    MDESCRIPTION   VARCHAR(4000) ,
	REGDAY         DATE,                 
    REGID          VARCHAR(500) NOT NULL,  
    MCOLOR         VARCHAR(500) NOT NULL,   
	HIDE_GB        INT DEFAULT 0 NOT NULL, 
    FAVORITE_GB    INT DEFAULT 0 NOT NULL, 
    DELETE_GB      INT DEFAULT 0 NOT NULL, 
    DELT_DATE      DATE,      
	RESTORE_DATE   DATE,
    PRIMARY KEY (MNO)
);

CREATE TABLE color_memo.COLOR (
    CNO            INT NOT NULL,      
    CNAME          VARCHAR(500) NOT NULL,    
    REGID          VARCHAR(1000) NOT NULL,
	PRIMARY KEY (CNO)
);

DROP TABLE color_memo.MEMBER;
DROP TABLE color_memo.MEMO;
DROP TABLE color_memo.COLOR;

select * from color_memo.MEMBER;
select * from color_memo.MEMO;
select * from color_memo.COLOR;

INSERT INTO color_memo.MEMBER VALUES ('lkj1032112@naver.com', 'dlwogns123', '이재훈', NULL);

commit;