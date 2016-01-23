#!/bin/bash

_switch() {
  local one=$1 ;
  local other='full' ;
  [[ $one ]] || one='lite' ;
  [[ "full" != "$one" ]] || other='lite' ;
  mv .git .git-$other ;
  mv .gitignore .gitignore-$other ;
  mv .git-$one .git ;
  mv .gitignore-$one .gitignore ;
}
if [[ -e .git-lite ]] ; then
  _switch lite ;
else
  _switch full ;
fi ;

#

