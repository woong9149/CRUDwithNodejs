DB_BACKUP="/home/dbbackup"

DB_USER="taxfriends"

DB_PASSWD="tpclsrnelql!@"

db="taxfriend2"

table="tablename"



# Remove backups older than 1 days

find $DB_BACKUP -ctime +1 -exec rm -f {} \;


# 데이터베이스를 모두 백업할경우
mysqldump --user=$DB_USER --password=$DB_PASSWD -A | gzip > "$DB_BACKUP/mysqldump-$db-$(date +%Y-%m-%d).gz";























