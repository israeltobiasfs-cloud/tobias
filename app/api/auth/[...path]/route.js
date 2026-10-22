import {auth} from '../../../../lib/auth';
export async function GET(r){return auth().handler().GET(r)}
export async function POST(r){return auth().handler().POST(r)}
