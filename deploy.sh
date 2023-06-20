rsync -av \
  -e "/usr/bin/ssh" \
  ./html/ cbppapps@apps.cbpp.org:/home/cbppapps/apps.cbpp.org/6-20-23fa/

rsync -av \
  -e "/usr/bin/ssh" \
  ./node/prod/ cbppapps@apps.cbpp.org:/home/cbppapps/apps.cbpp.org/6-20-23fa/js/