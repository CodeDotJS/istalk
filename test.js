import childProcess from 'child_process';
import test from 'ava';

test.cb('user()', t => {
	const cp = childProcess.spawn('./cli.js', ['iama_rishi'], {stdio: 'inherit'});

	cp.on('error', t.ifError);

	cp.on('close', code => {
		t.is(code, 0);
		t.end();
	});
});
