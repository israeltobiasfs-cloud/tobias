import {auth} from '../../../../lib/auth';
export async function GET(request,context){return auth().handler().GET(request,context)}
export async function POST(request,context){return auth().handler().POST(request,context)}
