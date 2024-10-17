from fastapi import APIRouter, HTTPException, Depends
from app.db.base import get_db_1
from sqlalchemy.orm import Session
from datetime import date
from sqlalchemy import text

router = APIRouter()

@router.get("/")
async def get_ppc(workdate: date = None, style: str = None, line: str = None, page: int = 1, size: int = 20, db: Session = Depends(get_db_1)):
    try:
        offset = (page - 1) * size + 1
        query = f"SELECT *, ROW_NUMBER() OVER (ORDER BY WorkDate DESC) AS RowNum FROM PPC"
        
        filters = {
            "WorkDate": workdate,
            "Style_P": style,
            "Line": line
        }

        conditions = []
        for column, value in filters.items():
            if value is not None:
                conditions.append(f"{column} = '{value}'")
        
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        
        last_query = f"WITH TEMP AS ({query}) SELECT * FROM TEMP WHERE RowNum BETWEEN {offset} AND {offset + size - 1}"
        
        res = db.execute(text(last_query)).fetchall()
        data = [dict(row._mapping) for row in res]
        
        count_query = f"SELECT COUNT(*) FROM PPC"
        if conditions:
            count_query += " WHERE " + " AND ".join(conditions)
        total_count = db.execute(text(count_query)).scalar()
    
        return {
            "data": data,
            "total_page": (total_count + size - 1) // size
        }
    except Exception as e:
        print(e)
        HTTPException(status_code=500, detail="Internal server error")

