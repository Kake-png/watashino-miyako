import test from 'node:test';
import assert from 'node:assert/strict';
import redirect from '../migration/old-worker/redirect.mjs';
test('old Worker redirects each path and query to the fixed new origin',()=>{
 for(const path of ['/', '/station/osaki/', '/?tags=cinema&wish=library','/station/%E6%9D%B1%E4%BA%AC/?x=1']){
  const response=redirect.fetch(new Request(`https://watashino-miyako.kake-web.workers.dev${path}`));
  assert.equal(response.status,301);assert.equal(response.headers.get('Location'),`https://machierabi-annai.kake-web.workers.dev${path}`);
 }
});
