rsync -av \
  -e "/usr/bin/ssh" \
  ./html/ cbppapps@apps.cbpp.org:/home/cbppapps/apps.cbpp.org/6-20-23fa_rev7-27-23/

rsync -av \
  -e "/usr/bin/ssh" \
  ./node/prod/ cbppapps@apps.cbpp.org:/home/cbppapps/apps.cbpp.org/6-20-23fa_rev7-27-23/js/